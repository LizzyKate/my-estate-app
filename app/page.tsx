import { redirect } from "next/navigation";

// No public role picker in production — residents, security and admin are
// separate authenticated surfaces reached via their own direct links/kiosks
// (see Sheet on access model). A stray visit to "/" lands on the resident
// sign-in, since that's the entry point a stranger is most likely to hit.
export default function HomePage() {
  redirect("/resident/sign-in");
}
