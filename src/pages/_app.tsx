import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return  <>
  <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
  </Head>
  <Component {...pageProps} />
  <style jsx global>{`
        html, body {
          height: 100%; /* This makes sure the html and body elements take up the full height of the viewport */
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          min-height: 100vh
        }
        body {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 
            Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 16px;
          color: #333;
          margin: 0;
          padding: 0;
          // Additional global styles
        }
        input, button {
          margin: 10px;
          padding: 10px;
        }
        button {
          box-sizing: border-box;
          background-color: black; /* Primary button color */
          color: white; /* Text color */
          border: none; /* No borders */
          padding: 10px 20px; /* Adjust padding as needed */
          font-size: 16px; /* Font size */
          font-family: 'Roboto', sans-serif; /* Font family */
          cursor: pointer; /* Pointer cursor on hover */
          outline: none; /* No outline */
          border-radius: 5px; /* Slightly rounded corners */
          transition: background-color 0.3s, transform 0.1s; /* Smooth transition for hover effects */
        }
        
        button:hover, button:focus {
          background-color: #333333; /* Darker shade on hover */
          transform: translateY(-2px); /* Slight raise effect on hover */
        }
        
      `}</style>
  </>
}
