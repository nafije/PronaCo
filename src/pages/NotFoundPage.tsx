import { paths } from "@/constants/routes";
import { useLang } from "@/lib/i18n";
import { Layout } from "@/components/site/Layout";
import { ButtonLink, Container } from "@/components/site/primitives";

export function NotFoundPage() {
  const { t } = useLang();
  return (
    <Layout title={t("Faqja nuk u gjet", "Page not found")}>
      <Container className="flex min-h-svh flex-col items-center justify-center text-center">
        <p className="font-serif text-[clamp(8rem,25vw,20rem)] leading-none font-light text-clay italic">404</p>
        <h1 className="mt-4 font-serif text-4xl">
          {t("Kjo faqe nuk ekziston — ose prona është shitur.", "This page doesn't exist — or the home has already sold.")}
        </h1>
        <div className="mt-10">
          <ButtonLink to={paths.properties}>{t("Shiko pronat", "Browse properties")}</ButtonLink>
        </div>
      </Container>
    </Layout>
  );
}
