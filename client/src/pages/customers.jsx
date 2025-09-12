import React, { useState, useEffect } from "react";

import acmeLogo from "@assets/acme.png";
import globexLogo from "@assets/globex.png";
import soylentLogo from "@assets/soylent.png";
import initechLogo from "@assets/initech.png";

const customersData = [
  { id: 1, name: "Acme Corp", category: "Technology", logo: acmeLogo },
  { id: 2, name: "Globex", category: "Finance", logo: globexLogo },
  { id: 3, name: "Soylent", category: "Healthcare", logo: soylentLogo },
  { id: 4, name: "Initech", category: "Technology", logo: initechLogo },
];

function Customers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch = customer.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || customer.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* ✅ Dark mode toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="px-4 py-2 mb-6 rounded bg-gray-200 dark:bg-gray-700"
      >
        Toggle {dark ? "Light" : "Dark"} Mode
      </button>

      {/* ✅ Search + Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="All">All</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
        </select>
      </div>

      {/* ✅ Customer Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={customer.logo}
              alt={customer.name}
              className="w-20 h-20 object-contain mb-3"
            />
            <p className="text-sm font-medium">{customer.name}</p>
            <p className="text-xs text-gray-500">{customer.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
