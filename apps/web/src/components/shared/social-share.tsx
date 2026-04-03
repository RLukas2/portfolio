import { Button } from '@xbrk/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@xbrk/ui/dropdown-menu';
import Icon from '@xbrk/ui/icon';
import { Mail, Share2 } from 'lucide-react';
import { SOCIAL_SHARE_PLATFORMS } from '@/lib/constants/social-share';

interface SocialShareProps {
  text?: string;
  url: string;
}

const SocialShare = ({ url, text }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = text ? encodeURIComponent(text) : '';

  const shareLinks = SOCIAL_SHARE_PLATFORMS.map((platform) => ({
    name: platform.name,
    icon: platform.icon,
    href: platform.getUrl(encodedUrl, encodedText),
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" size="sm" variant="outline">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((link) => (
          <DropdownMenuItem asChild key={link.name}>
            <a className="flex items-center gap-3" href={link.href} rel="noreferrer noopener" target="_blank">
              <Icon className="h-4 w-4" icon={link.icon} />
              {link.name}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <a
            className="flex items-center gap-3"
            href={`mailto:?subject=${encodedText}&body=${encodedUrl}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
