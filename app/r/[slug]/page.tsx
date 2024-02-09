import {fetchSubredditPosts} from '@/app/actions'
import BackToTop from '@/app/r/[slug]/components/BackToTop'
import Posts from '@/app/r/[slug]/components/Posts'
import config from '@/lib/config'
import {PageProps} from '@/lib/types'
import type {Metadata} from 'next'
import Link from 'next/link'
import BossButton from '@/app/r/[slug]/components/BossButton'

/**
 * Generate metadata.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  return {
    title: `${config.siteName} - ${params.slug}`,
    description: `The latest posts from the ${params.slug} subreddit`,
    alternates: {
      canonical: `${config.siteUrl}r/${params.slug}`
    },
    openGraph: {
      description: `The latest posts from the ${params.slug} subreddit`,
      url: `${config.siteUrl}r/${params.slug}`
    }
  }
}

/**
 * The single subreddit route.
 */
export default async function Page(props: PageProps) {
  // Get the params.
  const slug = props.params.slug || config.redditApi.sub

  // Get the search parameters.
  const limit = props.searchParams.limit || config.redditApi.limit
  const sortBy = props.searchParams.sortBy || config.redditApi.sortBy
  let after = props.searchParams.after || ''

  // Fetch the subreddit posts.
  const posts = await fetchSubredditPosts({slug, sortBy, limit, after})

  // Error? Bail.
  if (posts.error || !posts.data) {
    return (
      <div className="text-center">
        <h2>Uh oh!</h2>
        <pre>{posts.error}</pre>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="mt-0">
        Viewing <span className="italic">{slug}</span>
      </h2>
      <Posts {...posts} />
      <Link
        className="button"
        href={{pathname: `/r/${slug}`, query: {after: posts.data.after}}}
      >
        Load More
      </Link>
      <BossButton />
      <BackToTop />
    </div>
  )
}