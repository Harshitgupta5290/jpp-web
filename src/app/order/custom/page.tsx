import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'

export default function CustomOrderPage() {
  return (
    <PageWrapper>
      <div className="container-page py-16 max-w-xl mx-auto text-center">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-3">Custom Order</h1>
        <p className="text-text-secondary mb-8">
          Need something not in our standard catalog? Tell us what you need and we&apos;ll get back to you with a custom quote within 2 hours.
        </p>
        <a
          href={`https://wa.me/919999999999?text=${encodeURIComponent('Hi! I need a custom printing quote.')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg">Chat on WhatsApp for a Custom Quote</Button>
        </a>
        <p className="mt-4 text-sm text-text-secondary">
          Or{' '}
          <Link href="/catalog" className="text-brand-blue hover:underline">
            browse our standard products →
          </Link>
        </p>
      </div>
    </PageWrapper>
  )
}
