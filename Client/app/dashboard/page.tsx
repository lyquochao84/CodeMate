'use client';
import React from "react";
import styles from './dashboard.module.css';
import { useAuth } from "@/hooks/useAuth";

const DashBoard: React.FC = (): JSX.Element => {
    const { loading } = useAuth();

    if (loading) return <p>Loading...</p>
    
    return (
        <h1>DashBoard</h1>
    );
};

export default DashBoard;
