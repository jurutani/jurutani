/**
 * Plugin Nuxt untuk mengatur global SEO meta tags
 * Memastikan semua meta tags diterapkan dengan konsisten
 */

import siteMeta from '@/site'

export default defineNuxtPlugin(() => {
    // Set global head dengan meta tags penting untuk SEO
    useHead({
        htmlAttrs: {
            lang: siteMeta.defaultLocale,
        },
        title: siteMeta.title,
        meta: [
            // Basic Meta Tags
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
            },
            {
                name: 'description',
                content: siteMeta.description,
            },
            {
                name: 'keywords',
                content: 'juru tani, pertanian, penyuluhan, digital, petani indonesia, teknologi pertanian, polbangtan',
            },

            // Author & Publisher Meta Tags (PENTING untuk SEO)
            {
                name: 'author',
                content: siteMeta.author,
            },
            {
                name: 'publisher',
                content: siteMeta.publisher,
            },
            {
                name: 'creator',
                content: siteMeta.author,
            },
            {
                name: 'rights',
                content: `© 2024 ${siteMeta.publisher}. All rights reserved.`,
            },

            // Robots Meta Tag (index, follow - penting untuk SEO)
            {
                name: 'robots',
                content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
            {
                name: 'googlebot',
                content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
            {
                name: 'bingbot',
                content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },

            // Canonical URL (untuk menghindari duplicate content)
            // Catatan: Link canonical akan di-set per page menggunakan useSeoMeta()

            // Open Graph Meta Tags (untuk social media sharing)
            {
                property: 'og:site_name',
                content: siteMeta.title,
            },
            {
                property: 'og:type',
                content: 'website',
            },
            {
                property: 'og:locale',
                content: 'id_ID',
            },
            {
                property: 'og:locale:alternate',
                content: 'en_US',
            },

            // Twitter Card Meta Tags
            {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
            {
                name: 'twitter:site',
                content: siteMeta.twitter,
            },
            {
                name: 'twitter:creator',
                content: siteMeta.twitter,
            },

            // Color Meta Tags (untuk mobile branding)
            {
                name: 'theme-color',
                content: '#22c55e',
            },
            {
                name: 'msapplication-TileColor',
                content: '#22c55e',
            },

            // Additional Meta Tags untuk SEO
            {
                name: 'apple-mobile-web-app-capable',
                content: 'yes',
            },
            {
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'black-translucent',
            },
            {
                name: 'apple-mobile-web-app-title',
                content: siteMeta.title,
            },

            // Referrer Policy
            {
                name: 'referrer',
                content: 'strict-origin-when-cross-origin',
            },

            // Format Detection
            {
                name: 'format-detection',
                content: 'telephone=no',
            },

            // Charset
            {
                charset: 'UTF-8',
            },
        ],
        link: [
            // Canonical Link - akan di-set per page
            // { rel: 'canonical', href: siteMeta.url } // Set di setiap page

            // Alternate Links untuk multi-language (optional)
            {
                rel: 'alternate',
                href: `${siteMeta.url}/id`,
                hrefLang: 'id',
            } as any,
            {
                rel: 'alternate',
                href: siteMeta.url,
                hrefLang: 'x-default',
            } as any,

            // Preconnect ke resources penting
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
                crossorigin: 'anonymous',
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: 'anonymous',
            },

            // DNS Prefetch
            {
                rel: 'dns-prefetch',
                href: 'https://cdn.jsdelivr.net',
            },

            // Manifest
            {
                rel: 'manifest',
                href: '/site.webmanifest',
            },

            // Icons
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
            {
                rel: 'apple-touch-icon',
                href: '/apple-touch-icon.png',
            },
        ],
    })

    // Alternative approach: Tambahkan JSON-LD schema di global plugin
    // Ini untuk Organization dan Website schema yang universal
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteMeta.url}/#organization`,
        name: siteMeta.organization.name,
        alternateName: siteMeta.organization.shortName,
        description: siteMeta.organization.description,
        url: siteMeta.organization.url,
        logo: {
            '@type': 'ImageObject',
            url: siteMeta.organization.logo,
            width: 256,
            height: 256,
        },
        sameAs: siteMeta.organization.sameAs,
        areaServed: 'ID',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: siteMeta.organization.email,
        },
    }

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteMeta.url}/#website`,
        url: siteMeta.url,
        name: siteMeta.title,
        description: siteMeta.description,
        publisher: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.organization.name,
        },
        creator: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.organization.name,
        },
        author: {
            '@type': 'Organization',
            '@id': `${siteMeta.url}/#organization`,
            name: siteMeta.author,
        },
        inLanguage: 'id',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteMeta.url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(organizationSchema),
                async: true,
            },
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(websiteSchema),
                async: true,
            },
        ],
    })
})
