import Image from "next/image";
import GenerativeCover from "./GenerativeCover";

/**
 * BlogCover — обложка статьи: иллюстрация из `post.cover`, если задана,
 * иначе фолбэк на GenerativeCover. Drop-in для контейнеров `absolute inset-0`.
 * Иллюстрации канона (docs/ILLUSTRATIONS.md) держат герой-объект справа,
 * поэтому object-cover безопасен на любых пропорциях контейнера.
 */
type Props = {
  seed: string;
  accent: string;
  cover?: string;
  className?: string;
  density?: number;
  priority?: boolean;
  sizes?: string;
};

export default function BlogCover({ seed, accent, cover, className, density, priority, sizes }: Props) {
  if (!cover) {
    return <GenerativeCover seed={seed} accent={accent} className={className} density={density} />;
  }
  return (
    <div className={className}>
      <Image
        src={cover}
        alt=""
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 1132px, 100vw"}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#191426]/65 via-transparent to-transparent" />
    </div>
  );
}
