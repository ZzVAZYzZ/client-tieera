"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/features/productSlice";

export const useFetchProducts = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const loading = status === "idle" || status === "loading";

  return { products, status, error, loading };
};
