import Footer from "@/components/shared/Footer";
import Nav from "@/components/shared/Nav";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default CommonLayout;
