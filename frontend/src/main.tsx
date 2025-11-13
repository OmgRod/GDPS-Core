import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";

import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
	return <div style={{ padding: 16, color: 'red' }}>An error occurred: {error.message}</div>;
}

const root = createRoot(document.getElementById("root")!);
root.render(
	<React.StrictMode>
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<App />
					<Toaster />
				</BrowserRouter>
			</QueryClientProvider>
		</ErrorBoundary>
	</React.StrictMode>
);
