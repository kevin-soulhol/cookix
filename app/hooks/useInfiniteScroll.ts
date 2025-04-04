import { useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '200px',
  threshold = 0.1,
  enabled = true
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    targetRef.current = node;
  }, []);

  useEffect(() => {
    if (!enabled || isLoading || !hasMore) return;
    
    // Toujours déconnecter l'observer précédent
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Créer un nouvel observer
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        onLoadMore();
      }
    }, {
      rootMargin,
      threshold
    });

    // Observer l'élément cible s'il existe
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, isLoading, onLoadMore, rootMargin, threshold]);

  return setTargetRef;
}