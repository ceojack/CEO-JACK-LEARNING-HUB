import { NextResponse } from "next/server";
import { protectedHeaders, recordAdminActivity, requireAdmin } from "../_lib";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";

type CourseInput = { title?: unknown; description?: unknown; category?: unknown; price?: unknown; imageUrl?: unknown; status?: unknown };
function parseCourse(input: CourseInput) {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const category = typeof input.category === "string" ? input.category.trim() : "";
  const imageUrl = typeof input.imageUrl === "string" ? input.imageUrl.trim() : "";
  const price = typeof input.price === "number" ? input.price : Number(input.price ?? 0);
  const status = input.status === "published" ? "published" : input.status === "draft" ? "draft" : "";
  if (title.length < 2 || title.length > 160 || description.length > 10000 || category.length > 100 || !Number.isFinite(price) || price < 0 || !status || imageUrl && !/^https?:\/\//i.test(imageUrl)) return null;
  return { title, description: description || null, category: category || null, price, image_url: imageUrl || null, status };
}

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const { data, error } = await result.auth.supabase.from("courses").select("id, title, description, category, price, image_url, status, created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Courses could not be loaded. Apply the admin course catalog migration if this table is missing new catalog fields." }, { status: 502 });
  const ids = (data ?? []).map((course) => course.id);
  const enrolledByCourse: Record<string, number> = {};
  if (ids.length) {
    const { data: enrollments } = await result.auth.supabase.from("enrollments").select("course_id").in("course_id", ids);
    for (const enrollment of enrollments ?? []) enrolledByCourse[enrollment.course_id] = (enrolledByCourse[enrollment.course_id] ?? 0) + 1;
  }
  return NextResponse.json({ courses: (data ?? []).map((course) => ({ ...course, enrollment_count: enrolledByCourse[course.id] ?? 0 })) }, { headers: protectedHeaders });
}

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const body = await readJsonBody(request, 16_384);
  const course = parseCourse((body.value ?? {}) as CourseInput);
  if (body.error || !course) return NextResponse.json({ error: "Enter a title, a non-negative price, and a valid status and image URL." }, { status: 400 });
  try {
    const { data, error } = await result.auth.supabase.from("courses").insert(course).select("id").single();
    if (error) return NextResponse.json({ error: "The course could not be created." }, { status: 502 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "course.created", "course", data.id, { title: course.title });
    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "The course could not be created. Try again, and check the course table schema if the error continues." }, { status: 502 });
  }
}
