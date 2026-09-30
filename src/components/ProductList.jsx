import React, { useState, useEffect } from "react";
import { Filters } from "./Filters";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ЗАДАНИЕ 1: categories (теперь массив) //
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  // 1. Загрузка данных при монтировании //
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Ошибка сети: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  //  Фильтрация при изменении товаров или фильтров //
  useEffect(() => {
    let result = products;

    //  проверка по массиву категорий //
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    setFilteredProducts(result);
  }, [products, filters]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Загрузка товаров...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", padding: "2rem" }}>
        Ошибка: {error}
      </p>
    );
  }

  return (
    <section>
      <Filters onFilterChange={setFilters} initialFilters={filters} />

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", padding: "2rem" }}>
          Товары не найдены по выбранным фильтрам.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}