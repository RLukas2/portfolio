const config = {
  theme: {
    extend: {
      typography: (theme: (value: string) => void) => ({
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            lineHeight: '1.8',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h1: {
              fontSize: '2.25rem',
              fontWeight: '700',
              marginTop: '0',
              marginBottom: '0.875em',
              lineHeight: '1.2',
            },
            h2: {
              fontSize: '1.75rem',
              fontWeight: '600',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3',
            },
            h3: {
              fontSize: '1.375rem',
              fontWeight: '600',
              marginTop: '1.75em',
              marginBottom: '0.75em',
              lineHeight: '1.4',
            },
            h4: {
              fontSize: '1.125rem',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
            },
            'h5, h6': {
              fontSize: '1rem',
              fontWeight: '600',
              marginTop: '1.25em',
              marginBottom: '0.5em',
            },
            a: {
              textDecoration: 'none',
              color: 'var(--primary)',
              '&:hover': {
                textDecoration: 'underline',
                color: 'var(--primary)',
              },
              code: { color: 'var(--primary)' },
            },
            'h2, h3, h4, h5, h6': {
              position: 'relative',
              color: 'var(--foreground)',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            img: {
              margin: '0 auto',
            },
            figcaption: {
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem',
              textAlign: 'center',
            },
            'code, pre code': {
              fontFamily: 'var(--font-mono)',
            },
            pre: {
              background: 'var(--code)',
              padding: '1rem 0',
              lineHeight: 2,
              '[data-line-numbers]': {
                '[data-line]::before': {
                  counterIncrement: 'lineNumber',
                  content: 'counter(lineNumber)',
                  display: 'inline-block',
                  width: '1rem',
                  marginRight: '1rem',
                  textAlign: 'right',
                  color: 'var(--muted-foreground) / 0.6',
                },
              },
              '> code': {
                display: 'grid',
                counterReset: 'lineNumber',
                '> [data-line]': {
                  padding: '0 1rem 0 1rem',
                  borderLeft: '2px solid transparent',
                  lineHeight: 1.5,
                },
                '> [data-highlighted-line]': {
                  borderLeftColor: theme('colors.red.300'),
                  background: 'var(--primary) / 0.2',
                  '> span': {
                    backgroundColor: 'transparent',
                  },
                },
              },
            },
            blockquote: {
              color: 'var(--muted-foreground)',
              borderLeftColor: 'var(--primary)',
            },
            'p strong': {
              color: 'var(--foreground)',
            },
          },
        },
      }),
    },
  },
};

export default config;
