import { redirect } from "next/navigation";

/** De aparte dienstenpagina bestaat niet meer: we sturen door naar de diensten op de homepage. */
export default function DienstenPage() {
  redirect("/#diensten");
}
