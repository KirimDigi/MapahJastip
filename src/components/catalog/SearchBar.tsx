import React from 'react';
import { TRENDING_KEYWORDS } from '../../constants/categories';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onKeywordClick: (keyword: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onKeywordClick,
}) => {
  return (
    <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-sm border border-border-subtle/80 space-y-4">
      {/* Search Input & Sort Dropdown */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari barang Jepang, merek, atau toko (mis: Tokyo Banana Sakura, Onitsuka, Nendoroid...)"
            className="w-full pl-12 pr-10 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md placeholder:text-text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container border border-transparent focus:border-border-subtle transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-on-surface p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative shrink-0 flex items-center gap-2">
          <label htmlFor="sortSelector" className="hidden sm:inline-block font-label-md text-label-md text-text-secondary">
            Urutkan:
          </label>
          <div className="relative w-full md:w-56">
            <select
              id="sortSelector"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none bg-surface-container-low py-3 pl-4 pr-10 rounded-xl font-label-md text-label-md text-on-surface border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer"
            >
              <option value="populer">Paling Banyak Dititip</option>
              <option value="termurah">Harga: Terendah ke Tinggi</option>
              <option value="tertinggi">Harga: Tertinggi ke Rendah</option>
              <option value="rilis_baru">Baru Rilis di Jepang</option>
              <option value="batch_dekat">Batch Terdekat (Prioritas)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary text-[20px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Trending Keyword Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="font-label-sm text-label-sm text-text-secondary flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-primary">trending_up</span>
          Sering Dicari:
        </span>
        {TRENDING_KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => onKeywordClick(kw)}
            className="text-left px-3 py-1 rounded-full bg-surface-soft-blue hover:bg-surface-light-blue text-primary font-label-sm text-label-sm transition-colors border border-border-subtle/50"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
};
