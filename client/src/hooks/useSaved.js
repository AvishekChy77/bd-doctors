import { useCallback, useEffect, useState } from 'react';

const KEY = 'saved-doctors';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

export default function useSaved() {
  const [saved, setSaved] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const toggle = useCallback(
    (slug) =>
      setSaved((s) =>
        s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug],
      ),
    [],
  );

  return { saved, toggle, isSaved: (slug) => saved.includes(slug) };
}
