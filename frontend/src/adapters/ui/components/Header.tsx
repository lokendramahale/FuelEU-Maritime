import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white py-3 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-lg font-semibold tracking-wide">
          ⚓ FuelEU Maritime Dashboard
        </h1>
        <nav>
          <a
            href="https://maritime.europa.eu"
            target="_blank"
            className="underline text-sm hover:text-blue-200"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
};
