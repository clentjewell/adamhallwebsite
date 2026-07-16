import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/** Standard page shell: sticky header + routed content + footer. */
export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
