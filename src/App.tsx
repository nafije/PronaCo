import { Route, Routes, useParams } from "react-router-dom";
import { paths } from "@/constants/routes";
import { Cursor } from "@/components/fx/Cursor";
import { Preloader } from "@/components/fx/Preloader";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PropertiesPage } from "@/pages/PropertiesPage";
import { PropertyPage } from "@/pages/PropertyPage";

/** Remount per listing so moving between properties starts fresh (scroll, video, animations). */
function PropertyRoute() {
  const { slug } = useParams();
  return <PropertyPage key={slug} />;
}

export function App() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Routes>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.properties} element={<PropertiesPage />} />
        <Route path={paths.property(":slug")} element={<PropertyRoute />} />
        <Route path={paths.contact} element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
