"use client";
import { CategoryPageClient } from "./category-page-client";

export function CategoryPage({ slug }: { slug: string }) {
  return <CategoryPageClient slug={slug} />;
}