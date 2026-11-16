import type { VerifiedMemberCardData, VerifiedMemberTheme } from '@/src/utils/verified-member'

function drawRoundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

export async function drawVerifiedCard(card: VerifiedMemberCardData, qrDataUrl: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 680;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Card image could not be created on this device.");

  const gradients: Record<VerifiedMemberTheme, [string, string]> = {
    "royal-black": ["#101011", "#292315"],
    "ocean-blue": ["#061a3d", "#0c4b79"],
    "emerald-green": ["#062d25", "#14714e"],
    "royal-purple": ["#251044", "#702c78"],
    "sunset-orange": ["#f07838", "#b93369"],
  };
  const gradient = context.createLinearGradient(0, 0, 1080, 680);
  gradient.addColorStop(0, gradients[card.cardColour][0]);
  gradient.addColorStop(1, gradients[card.cardColour][1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.save();
  context.globalAlpha = 0.08;
  context.strokeStyle = "#ffffff";
  context.lineWidth = 1;
  for (let x = -680; x < 1500; x += 54) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 680, 680);
    context.stroke();
  }
  context.restore();

  context.save();
  context.translate(540, 350);
  context.rotate(-Math.PI / 8);
  context.fillStyle = "rgba(255,255,255,.075)";
  context.font = "800 74px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("CEO JACK LEARNING HUB", 0, -120);
  context.fillText("CEO JACK LEARNING HUB", 0, 150);
  context.restore();

  const gold = card.cardColour === "ocean-blue" ? "#bfe8ff" : card.cardColour === "sunset-orange" ? "#fff2dc" : "#ebc86f";
  const logo = new Image();
  logo.src = "/assets/images/logo1.webp";
  await new Promise<void>((resolve, reject) => {
    logo.onload = () => resolve();
    logo.onerror = () => reject(new Error("The CEO JACK logo could not be loaded for the download."));
  });
  context.save();
  drawRoundedRect(context, 56, 44, 58, 58, 11);
  context.clip();
  context.drawImage(logo, 56, 44, 58, 58);
  context.restore();
  context.textAlign = "left";
  context.font = "800 27px Arial, sans-serif";
  context.fillText("CEO JACK", 130, 68);
  context.font = "700 13px Arial, sans-serif";
  context.fillStyle = "rgba(255,255,255,.74)";
  context.fillText("LEARNING HUB", 132, 90);

  context.fillStyle = "rgba(0,0,0,.22)";
  drawRoundedRect(context, 815, 46, 210, 48, 24);
  context.fill();
  context.strokeStyle = gold;
  context.lineWidth = 2;
  drawRoundedRect(context, 815, 46, 210, 48, 24);
  context.stroke();
  context.fillStyle = gold;
  context.font = "700 15px Arial, sans-serif";
  context.fillText("♢  VERIFIED MEMBER", 837, 76);

  const photo = new Image();
  photo.crossOrigin = "anonymous";
  photo.src = card.photoUrl;
  await new Promise<void>((resolve, reject) => {
    photo.onload = () => resolve();
    photo.onerror = () => reject(new Error("Photo could not be added to the card download. Upload a photo and try again."));
  });
  context.save();
  context.beginPath();
  context.arc(188, 345, 126, 0, Math.PI * 2);
  context.clip();
  context.drawImage(photo, 62, 219, 252, 252);
  context.restore();
  context.beginPath();
  context.arc(188, 345, 130, 0, Math.PI * 2);
  context.strokeStyle = gold;
  context.lineWidth = 8;
  context.stroke();

  const nameFont = 54;
  context.fillStyle = "#ffffff";
  context.font = `800 ${nameFont}px Arial, sans-serif`;
  const name = card.fullName.length > 22 ? `${card.fullName.slice(0, 21)}…` : card.fullName;
  context.fillText(name, 360, 310, 510);
  const measuredName = Math.min(context.measureText(name).width, 510);
  context.beginPath();
  context.arc(360 + measuredName + 32, 292, 22, 0, Math.PI * 2);
  context.fillStyle = "#2588ff";
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = "800 27px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("✓", 360 + measuredName + 32, 302);
  context.textAlign = "left";

  context.fillStyle = gold;
  context.font = "700 22px Arial, sans-serif";
  context.fillText(`${card.hobby.toUpperCase()}  •  ${card.level.toUpperCase()} LEARNER`, 362, 362, 560);
  context.fillStyle = "rgba(255,255,255,.82)";
  context.font = "500 19px Arial, sans-serif";
  context.fillText(`ID: ${card.memberId}`, 362, 408);
  if (card.motto) {
    context.fillStyle = "rgba(255,255,255,.88)";
    context.font = "italic 19px Georgia, serif";
    context.fillText(`“${card.motto}”`, 362, 452, 510);
  }

  context.fillStyle = "rgba(255,255,255,.87)";
  context.font = "700 15px Arial, sans-serif";
  context.fillText(`MEMBER SINCE ${new Date(card.createdAt ?? Date.now()).getFullYear()}`, 62, 594);
  context.font = "500 17px Arial, sans-serif";
  context.fillStyle = "rgba(255,255,255,.72)";
  context.fillText("ceojacklearninghub.com", 62, 622);

  context.fillStyle = "#ffffff";
  drawRoundedRect(context, 886, 484, 138, 138, 14);
  context.fill();
  const qr = new Image();
  qr.src = qrDataUrl;
  await new Promise<void>((resolve, reject) => {
    qr.onload = () => resolve();
    qr.onerror = () => reject(new Error("The QR code could not be added to the card."));
  });
  context.drawImage(qr, 900, 498, 110, 110);
  return canvas;
}
