import { NextResponse } from "next/server";
import { runSeed } from "@/Infrastructure/seed/seed";
import { IdentityRepository } from "@/Infrastructure/repositories/identityRepository";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const identityRepo = new IdentityRepository();
    const existing = await identityRepo.findUserByLogin("admin");
    if (existing) {
      return NextResponse.json({ ok: true, created: false, phone: existing.phone });
    }

    const result = await runSeed();
    return NextResponse.json({ ok: true, created: true, adminId: result.adminId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "seed failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
