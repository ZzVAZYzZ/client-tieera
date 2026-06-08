"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/features/userSlice";

export const useFetchUsers = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return { users, status, error };
};

