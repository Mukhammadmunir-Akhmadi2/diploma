import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchSuggestion {
  id: string;
  name: string;
  type: "product" | "category" | "brand";
}

const mockSuggestions: SearchSuggestion[] = [
  { id: "1", name: "Leather Jacket", type: "product" },
  { id: "2", name: "Denim Collection", type: "category" },
  { id: "3", name: "Nike", type: "brand" },
  { id: "4", name: "Summer Dresses", type: "product" },
];

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      // In a real app, this would be an API call
      const filtered = mockSuggestions.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "product":
        navigate(`/product/${suggestion.id}`);
        break;
      case "category":
        navigate(`/category/${suggestion.id}`);
        break;
      case "brand":
        navigate(`/brand/${suggestion.id}`);
        break;
    }
    setQuery(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search"
          className="search-input w-full border border-gray-300 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          aria-label="Search"
        >
          <Search size={18} className="text-gray-500" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-xs ml-2 text-gray-500">
                  {suggestion.type === "product"
                    ? "Product"
                    : suggestion.type === "category"
                    ? "Category"
                    : "Brand"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
