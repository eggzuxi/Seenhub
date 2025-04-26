import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html>
            <Head />
            <body>
            <Main />
            <NextScript />
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=G-0WQGKJ1H7X`}
                async
            />
            <Script
                id="ga-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0WQGKJ1H7X');
            `,
                }}
            />
            </body>
        </Html>
    );
}