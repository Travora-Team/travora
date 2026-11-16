import { Link } from 'react-router-dom';
import { NOT_FOUND_MODEL } from '../models/notFoundModel';

export function NotFoundCard() {
  return (
    <>
      <p className="text-7xl font-black text-primary">{NOT_FOUND_MODEL.code}</p>
      <h1 className="mt-4 text-2xl font-black">{NOT_FOUND_MODEL.title}</h1>
      <Link
        to={NOT_FOUND_MODEL.ctaTo}
        className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 font-black text-white"
      >
        {NOT_FOUND_MODEL.ctaLabel}
      </Link>
    </>
  );
}
