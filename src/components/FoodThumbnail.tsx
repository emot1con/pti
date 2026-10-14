import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

interface FoodThumbnailProps {
  emoji: string
  thumb: [string, string]
  imageUrl?: string
  alt: string
  className?: string
  emojiClassName?: string
}

/**
 * Illustrated food thumbnail. Uses a photo when provided and gracefully falls
 * back to a warm gradient + emoji illustration when the image is missing or
 * fails to load.
 */
export function FoodThumbnail({
  emoji,
  thumb,
  imageUrl,
  alt,
  className,
  emojiClassName,
}: FoodThumbnailProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [imageUrl])

  const showImage = Boolean(imageUrl) && !failed

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-2xl',
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(circle at 30% 22%, rgba(255,255,255,0.5), transparent 58%), linear-gradient(135deg, ${thumb[0]}, ${thumb[1]})`,
      }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          role="img"
          aria-label={alt}
          className={cn(
            'grid h-full w-full place-items-center text-2xl drop-shadow-sm',
            emojiClassName,
          )}
        >
          {emoji}
        </span>
      )}
    </div>
  )
}
