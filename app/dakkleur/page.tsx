import { redirect } from "next/navigation";

/** De dakkleur-tool staat nu rechtstreeks op de homepage. */
export default function DakkleurPagina() {
  redirect("/#dakkleur");
}
