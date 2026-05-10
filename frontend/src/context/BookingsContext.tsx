import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ─── Types ──────────────────────────────────────────────────────── */
export type BookingType = "accommodation" | "food" | "gym" | "travel" | "grocery" | "utilities" | "misc";

export interface BookedItem {
  id: string;
  type: BookingType;
  name: string;
  area: string;
  city: string;
  monthlyCost: number;
  details: string;
  bookedAt: string;
}

interface BookingsContextType {
  bookings: BookedItem[];
  addBooking: (item: Omit<BookedItem, "id" | "bookedAt">) => void;
  removeBooking: (id: string) => void;
  clearBookings: () => void;
  totalMonthlySpend: number;
  getSavings: (salary: number, emi: number) => number;
  isBooked: (name: string, type: string) => boolean;
}

const BookingsContext = createContext<BookingsContextType | null>(null);

/* ─── Provider ──────────────────────────────────────────────────── */
export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookedItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sl_bookings");
    if (stored) {
      try { setBookings(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sl_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (item: Omit<BookedItem, "id" | "bookedAt">) => {
    const newItem: BookedItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookedAt: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, newItem]);
  };

  const removeBooking = (id: string) => setBookings((prev) => prev.filter((b) => b.id !== id));
  const clearBookings = () => setBookings([]);

  const totalMonthlySpend = bookings.reduce((sum, b) => sum + b.monthlyCost, 0);

  const getSavings = (salary: number, emi: number) => salary - emi - totalMonthlySpend;

  const isBooked = (name: string, type: string) =>
    bookings.some((b) => b.name === name && b.type === type);

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, removeBooking, clearBookings, totalMonthlySpend, getSavings, isBooked }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}
