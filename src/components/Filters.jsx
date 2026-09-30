import React from "react";

// Список категорий для чекбоксов (Задание 1)
const CATEGORIES = [
  { value: "electronics", label: "Электроника" },
  { value: "jewelery", label: "Ювелирные изделия" },
  { value: "men's clothing", label: "Мужская одежда" },
  { value: "women's clothing", label: "Женская одежда" },
];

const MIN_LIMIT = 0;
const MAX_LIMIT = 1000;

export function Filters({ onFilterChange, initialFilters }) {


  // ЗАДАНИЕ 1: категория теперь массив, а не строка
  const [localCategories, setLocalCategories] = React.useState(
    initialFilters.categories || []
  );

  const [localMinPrice, setLocalMinPrice] = React.useState(
    String(initialFilters.minPrice ?? "")
  );
  const [localMaxPrice, setLocalMaxPrice] = React.useState(
    String(initialFilters.maxPrice ?? "")
  );

  const [errors, setErrors] = React.useState({});

  // ЗАДАНИЕ 1: переключение чекбокса категории
  const toggleCategory = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  // Валидация
  const validate = () => {
    const errs = {};
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;

    if (min !== undefined && min < 0) {
      errs.min = "Цена не может быть отрицательной";
    }
    if (max !== undefined && max < 0) {
      errs.max = "Цена не может быть отрицательной";
    }
    if (
      min !== undefined &&
      max !== undefined &&
      min >= 0 &&
      max >= 0 &&
      min > max
    ) {
      errs.min = "Цена «от» не может быть больше цены «до»";
      errs.max = "Цена «до» не может быть меньше цены «от»";
    }
    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories, // массив
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    });
  };

  // Сброс ошибок при вводе
  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors((prev) => ({ ...prev, min: "" }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors((prev) => ({ ...prev, max: "" }));
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      
      
      
      /*  ЗАДАНИЕ 1: чекбоксы категорий  */
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
          Категории
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              <input
                type="checkbox"
                checked={localCategories.includes(cat.value)}
                onChange={() => toggleCategory(cat.value)}
              />
              {cat.label}
            </label>
          ))}
        </div>
        {localCategories.length === 0 && (
          <span style={{ fontSize: "0.85rem", color: "#777" }}>
            Ничего не выбрано — показываются все категории
          </span>
        )}
      </div>

      /*  ЗАДАНИЕ 2: ползунки + поля цены  */
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Мин. цена */}
        <div>
          <label>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            style={{
              width: "100%",
              padding: "8px",
              border: errors.min ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />



          /* ЗАДАНИЕ 2: ползунок для минимал. цены */
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            value={localMinPrice || MIN_LIMIT}
            onChange={handleMinChange}
            style={{ width: "100%", marginTop: "6px" }}
          />
          {errors.min && (
            <span style={{ color: "red", fontSize: "0.85rem" }}>
              {errors.min}
            </span>
          )}
        </div>

        /* Макс. цена */
        <div>
          <label>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder="9999"
            min="0"
            style={{
              width: "100%",
              padding: "8px",
              border: errors.max ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          
          
          
          /* ЗАДАНИЕ 2: ползунок для макс. цены */
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            value={localMaxPrice || MAX_LIMIT}
            onChange={handleMaxChange}
            style={{ width: "100%", marginTop: "6px" }}
          />
          {errors.max && (
            <span style={{ color: "red", fontSize: "0.85rem" }}>
              {errors.max}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: "10px 24px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}