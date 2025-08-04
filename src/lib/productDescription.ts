export interface ProductSpec {
  key: string;
  value: string;
}

export interface FormattedContent {
  html: string;
  features: string[];
  specifications: ProductSpec[];
  hasStructuredContent: boolean;
}

export class ProductDescriptionFormatter {
  /**
   * Converts plain text description to rich HTML with enhanced formatting
   */
  static formatDescription(description: string | null | undefined): string {
    if (!description) return '';

    return (
      description
        // Convert double line breaks to paragraphs
        .split('\n\n')
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map((paragraph) => {
          // Handle bullet points
          if (this.containsBulletPoints(paragraph)) {
            return this.formatBulletPoints(paragraph);
          }

          // Handle headings (lines that are all caps or end with colon)
          if (this.isHeading(paragraph)) {
            return this.formatHeading(paragraph);
          }

          // Handle specifications or key-value pairs
          if (this.isSpecification(paragraph)) {
            return this.formatSpecification(paragraph);
          }

          // Handle callout boxes (text wrapped in brackets or starting with "Note:")
          if (this.isCallout(paragraph)) {
            return this.formatCallout(paragraph);
          }

          // Regular paragraphs with enhanced styling
          return this.formatParagraph(paragraph);
        })
        .join('')
    );
  }

  /**
   * Extracts key features from description text
   */
  static extractFeatures(description: string | null | undefined): string[] {
    if (!description) return [];

    const features: string[] = [];
    const lines = description.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.match(/^[•\-\*]\s+/)) {
        const feature = trimmed.replace(/^[•\-\*]\s+/, '').trim();
        if (feature && !this.isSpecification(feature)) {
          features.push(feature);
        }
      }
    });

    return features;
  }

  /**
   * Extracts specifications from description text
   */
  static extractSpecs(description: string | null | undefined): ProductSpec[] {
    if (!description) return [];

    const specs: ProductSpec[] = [];
    const lines = description.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (this.isSpecification(trimmed)) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
          specs.push({
            key: key.trim().replace(/^[•\-\*]\s*/, ''),
            value,
          });
        }
      }
    });

    return specs;
  }

  /**
   * Processes description and returns all formatted content
   */
  static processDescription(description: string | null | undefined): FormattedContent {
    const html = this.formatDescription(description);
    const features = this.extractFeatures(description);
    const specifications = this.extractSpecs(description);
    const hasStructuredContent = features.length > 0 || specifications.length > 0;

    return {
      html,
      features,
      specifications,
      hasStructuredContent,
    };
  }

  /**
   * Enhanced text processing with support for basic markdown-like syntax
   */
  static enhanceText(text: string): string {
    return (
      text
        // Bold text (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
        .replace(/__(.*?)__/g, '<strong class="text-primary font-semibold">$1</strong>')
        // Italic text (*text* or _text_)
        .replace(/\*(.*?)\*/g, '<em class="text-text/70 italic">$1</em>')
        .replace(/_(.*?)_/g, '<em class="text-text/70 italic">$1</em>')
        // Inline code (`code`)
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
        // Links [text](url)
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">$1</a>'
        )
    );
  }

  // Private helper methods
  private static containsBulletPoints(paragraph: string): boolean {
    return paragraph.includes('•') || paragraph.includes('-') || paragraph.match(/^\s*[\*\-•]/) !== null;
  }

  private static formatBulletPoints(paragraph: string): string {
    const lines = paragraph.split('\n').map((line) => line.trim());
    const bulletPoints = lines.filter((line) => line.match(/^[•\-\*]\s+/));

    if (bulletPoints.length > 0) {
      const listItems = bulletPoints
        .map((point) => point.replace(/^[•\-\*]\s+/, ''))
        .map(
          (point) => `<li class="flex items-start space-x-3 py-2">
          <span class="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></span>
          <span class="text-text/80">${this.enhanceText(point)}</span>
        </li>`
        )
        .join('');

      return `<ul class="space-y-2 my-6 pl-0">${listItems}</ul>`;
    }

    return this.formatParagraph(paragraph);
  }

  private static isHeading(paragraph: string): boolean {
    return paragraph.match(/^[A-Z\s]+:?$/) !== null || paragraph.endsWith(':') || paragraph.match(/^#{1,6}\s/) !== null; // Markdown-style headers
  }

  private static formatHeading(paragraph: string): string {
    const cleanHeading = paragraph.replace(/[:#\s]+$/, '').replace(/^#+\s*/, '');
    return `<h3 class="text-xl font-semibold text-text mt-8 mb-4 border-b border-gray-200 pb-2">
      ${cleanHeading}
    </h3>`;
  }

  private static isSpecification(paragraph: string): boolean {
    return (
      paragraph.includes(':') && paragraph.split(':').length >= 2 && !paragraph.endsWith(':') && paragraph.length < 100
    ); // Reasonable spec length
  }

  private static formatSpecification(paragraph: string): string {
    const [key, ...valueParts] = paragraph.split(':');
    const value = valueParts.join(':').trim();
    const cleanKey = key.trim().replace(/^[•\-\*]\s*/, '');

    return `<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
      <div class="flex justify-between items-start">
        <span class="font-semibold text-text flex-shrink-0 mr-4">${cleanKey}</span>
        <span class="text-text/70 text-right">${this.enhanceText(value)}</span>
      </div>
    </div>`;
  }

  private static isCallout(paragraph: string): boolean {
    return (
      (paragraph.startsWith('[') && paragraph.endsWith(']')) ||
      paragraph.toLowerCase().startsWith('note:') ||
      paragraph.toLowerCase().startsWith('important:') ||
      paragraph.toLowerCase().startsWith('warning:')
    );
  }

  private static formatCallout(paragraph: string): string {
    let content = paragraph;
    let type = 'info';
    let icon = 'ℹ️';

    if (paragraph.startsWith('[') && paragraph.endsWith(']')) {
      content = paragraph.slice(1, -1);
    } else if (paragraph.toLowerCase().startsWith('note:')) {
      content = paragraph.substring(5).trim();
      type = 'note';
      icon = '📝';
    } else if (paragraph.toLowerCase().startsWith('important:')) {
      content = paragraph.substring(10).trim();
      type = 'warning';
      icon = '⚠️';
    } else if (paragraph.toLowerCase().startsWith('warning:')) {
      content = paragraph.substring(8).trim();
      type = 'error';
      icon = '🚨';
    }

    const bgColor =
      type === 'error'
        ? 'bg-red-50 border-red-200'
        : type === 'warning'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-blue-50 border-blue-200';

    return `<div class="callout ${bgColor} border rounded-lg p-4 my-6">
      <div class="flex items-start space-x-3">
        <span class="flex-shrink-0 text-lg">${icon}</span>
        <div class="text-text/80 leading-relaxed">${this.enhanceText(content)}</div>
      </div>
    </div>`;
  }

  private static formatParagraph(paragraph: string): string {
    return `<p class="text-text/80 leading-relaxed mb-6">${this.enhanceText(paragraph)}</p>`;
  }
}

/**
 * Utility functions for product content analysis
 */
export class ProductContentAnalyzer {
  /**
   * Analyzes description content and returns insights
   */
  static analyzeContent(description: string | null | undefined): {
    wordCount: number;
    hasFeatures: boolean;
    hasSpecs: boolean;
    hasCallouts: boolean;
    readabilityScore: 'easy' | 'moderate' | 'difficult';
    contentType: 'basic' | 'structured' | 'rich';
  } {
    if (!description) {
      return {
        wordCount: 0,
        hasFeatures: false,
        hasSpecs: false,
        hasCallouts: false,
        readabilityScore: 'easy',
        contentType: 'basic',
      };
    }

    const wordCount = description.split(/\s+/).length;
    const hasFeatures = ProductDescriptionFormatter.extractFeatures(description).length > 0;
    const hasSpecs = ProductDescriptionFormatter.extractSpecs(description).length > 0;
    const hasCallouts = description.includes('[') || /\b(note|important|warning):/i.test(description);

    // Simple readability calculation based on sentence length and word complexity
    const sentences = description.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
    const complexWords = description.split(/\s+/).filter((word) => word.length > 6).length;
    const complexWordRatio = complexWords / wordCount;

    const readabilityScore =
      avgSentenceLength > 20 || complexWordRatio > 0.3
        ? 'difficult'
        : avgSentenceLength > 15 || complexWordRatio > 0.2
          ? 'moderate'
          : 'easy';

    const contentType = hasFeatures && hasSpecs ? 'rich' : hasFeatures || hasSpecs ? 'structured' : 'basic';

    return {
      wordCount,
      hasFeatures,
      hasSpecs,
      hasCallouts,
      readabilityScore,
      contentType,
    };
  }

  /**
   * Generates SEO-friendly excerpt from description
   */
  static generateExcerpt(description: string | null | undefined, maxLength: number = 160): string {
    if (!description) return '';

    // Remove any HTML tags and extra whitespace
    const cleanText = description
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length <= maxLength) return cleanText;

    // Find the last complete sentence within the limit
    const truncated = cleanText.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > maxLength * 0.5) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }

    // If no good sentence break, find last word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }
}
