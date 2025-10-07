import React from 'react';
import Layout from '../../components/Layout';

export default function Privacy() {
    const title = "Privacy Policy";

    return (
        <Layout>
            <div className="container mt-5">
                <h1>{title}</h1>
                <p>Use this page to detail your site's privacy policy.</p>
            </div>
        </Layout>
    );
}