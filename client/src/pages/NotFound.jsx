import { Link } from 'react-router-dom';
import PageWrap from '../components/PageWrap';

export default function NotFound() {
  return (
    <PageWrap className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 text-center">
      <div>
        <p className="text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-3 text-2xl font-extrabold">Page not found</h1>
        <p className="font-bangla mt-2 text-slate-400">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </PageWrap>
  );
}
