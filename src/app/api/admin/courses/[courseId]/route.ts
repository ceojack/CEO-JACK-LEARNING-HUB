import { NextResponse } from "next/server";
import { protectedHeaders, recordAdminActivity, requireAdmin } from "../../_lib";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ courseId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const { courseId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) return NextResponse.json({ error: "Invalid course." }, { status: 400 });
  const body = await readJsonBody(request, 16_384);
  const input = (body.value ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  if (typeof input.title === "string" && input.title.trim().length >= 2 && input.title.trim().length <= 160) update.title = input.title.trim();
  if (typeof input.description === "string" && input.description.length <= 10000) update.description = input.description.trim() || null;
  if (typeof input.category === "string" && input.category.length <= 100) update.category = input.category.trim() || null;
  if (typeof input.image_url === "string" && (!input.image_url || /^https?:\/\//i.test(input.image_url))) update.image_url = input.image_url.trim() || null;
  if (typeof input.price === "number" && Number.isFinite(input.price) && input.price >= 0) update.price = input.price;
  if (input.status === "draft" || input.status === "published") update.status = input.status;
  if (body.error || !Object.keys(update).length) return NextResponse.json({ error: "Enter at least one valid course field." }, { status: 400 });
  try {
    const { error } = await result.auth.supabase.from("courses").update(update).eq("id", courseId);
    if (error) return NextResponse.json({ error: "The course could not be updated." }, { status: 502 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "course.updated", "course", courseId, { fields: Object.keys(update).join(",") });
    return NextResponse.json({ success: true }, { headers: protectedHeaders });
  } catch {
    return NextResponse.json({ error: "The course could not be updated. Check the course catalog schema and try again." }, { status: 502 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const { courseId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) return NextResponse.json({ error: "Invalid course." }, { status: 400 });
  try {
    const { error } = await result.auth.supabase.from("courses").delete().eq("id", courseId);
    if (error?.code === "23503") return NextResponse.json({ error: "This course has lessons or enrollments. Remove those records before deleting the course." }, { status: 409 });
    if (error) return NextResponse.json({ error: "The course could not be deleted." }, { status: 502 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "course.deleted", "course", courseId);
    return NextResponse.json({ success: true }, { headers: protectedHeaders });
  } catch {
    return NextResponse.json({ error: "The course could not be deleted. Try again." }, { status: 502 });
  }
}
