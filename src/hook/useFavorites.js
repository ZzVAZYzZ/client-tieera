"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  favoriteProduct,
  getUserFavorites,
  unFavoriteProduct,
} from "../redux/features/favoritesSlice";

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { favorites, status, error } = useSelector((state) => state.favorites);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("access_token");
    setToken(stored);
  }, []);

  React.useEffect(() => {
    if (!token) return;
    dispatch(getUserFavorites({ token }));
  }, [dispatch, token]);

  const favoriteIds = React.useMemo(
    () => favorites.map((item) => String(item.product_id)),
    [favorites]
  );

  const addFavorite = React.useCallback(
    (productId) => {
      if (!token) {
        alert("Vui lòng đăng nhập để thêm sản phẩm yêu thích");
        return Promise.reject(new Error("Missing access token"));
      }
      return dispatch(favoriteProduct({ productId, token })).unwrap();
    },
    [dispatch, token]
  );

  const removeFavorite = React.useCallback(
    (productId) => {
      if (!token) {
        alert("Vui lòng đăng nhập để bỏ yêu thích");
        return Promise.reject(new Error("Missing access token"));
      }
      return dispatch(unFavoriteProduct({ productId, token })).unwrap();
    },
    [dispatch, token]
  );

  const refetchFavorites = React.useCallback(() => {
    if (!token) return;
    dispatch(getUserFavorites({ token }));
  }, [dispatch, token]);

  return {
    favorites,
    favoriteIds,
    favoritesStatus: status,
    favoritesError: error,
    addFavorite,
    removeFavorite,
    refetchFavorites,
    token,
  };
};

