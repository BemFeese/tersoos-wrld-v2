import { Suspense } from "react";
import PaidStatus from "../../components/PaidStatus";

export const metadata = { title: "Payment — Tersoo's Wrld" };

export default function PaidPage() {
  return (
    <main style={{ paddingTop: "calc(var(--nav-h) + 4rem)" }}>
      <Suspense>
        <PaidStatus />
      </Suspense>
    </main>
  );
}
