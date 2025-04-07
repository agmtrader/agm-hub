'use client'
import { cn } from '@/lib/utils';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { downloads } from '@/lib/downloads';

const DownloadsPage = () => {
    const {lang} = useTranslationProvider();
  
  // Split downloads into desktop and mobile platforms
  const desktopDownloads = downloads.slice(0, 3);
  const mobileDownloads = downloads.slice(3);

  return (
    <div className="min-h-screen w-full relative bg-background">

      {/* Content with higher z-index */}
      <div className="container py-8 my-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col my-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Download AGM Trader Pro
            </h1>
            <p className="text-lg max-w-xl mx-auto text-subtitle mb-10">
              AGM Trader Pro is our flagship product, a trading platform that allows you to trade stocks, options, futures, and more.
            </p>
          </div>

          <div className="flex flex-col gap-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Desktop Platforms</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {desktopDownloads.map((option) => (
                  <div
                    key={option.os}
                    className="bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <option.icon className="h-12 w-12 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-center text-foreground mb-4">
                        {option.os}
                      </h2>
                      <div className="space-y-3">
                        {option.versions.map((version) => (
                          <div key={version.arch}>
                            <a
                              href={version.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "block w-full text-center py-2.5 px-3 rounded-md transition-colors duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                version.recommended
                                  ? "bg-primary text-white hover:bg-primary/90"
                                  : "bg-muted text-foreground hover:bg-muted/90"
                              )}
                              download
                              role="button"
                              tabIndex={0}
                              aria-label={`Download ${option.os} ${version.arch}`}
                            >
                              Download {version.arch}
                              {version.recommended && (
                                <span className="ml-2 text-sm">(Recommended)</span>
                              )}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Mobile Platforms</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {mobileDownloads.map((option) => (
                  <div
                    key={option.os}
                    className="bg-background rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <option.icon className="h-12 w-12 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-center text-foreground mb-4">
                        {option.os}
                      </h2>
                      <div className="space-y-3">
                        {option.versions.map((version) => (
                          <div key={version.arch}>
                            <a
                              href={version.url}
                              className="block w-full text-center py-2.5 px-3 rounded-md transition-colors duration-200 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              role="button"
                              tabIndex={0}
                              aria-label={`Download ${option.os} from ${version.arch}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download from {version.arch}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-subtitle">
            <p>
              By downloading, you agree to our{' '}
              <a
                href={formatURL('/disclosures', lang)}
                className="text-primary hover:text-primary/90 underline"
                tabIndex={0}
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
