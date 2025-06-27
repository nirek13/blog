
import React from 'react';

export const renderMarkdown = (content: string, userClearance: 'admin' | 'friend' | 'public') => {
  // Filter content based on clearance level
  let filteredContent = content;
  
  const clearanceLevels = { public: 0, friend: 1, admin: 2 };
  const userLevel = clearanceLevels[userClearance];
  
  // Remove admin-only sections if user doesn't have admin access
  if (userLevel < 2) {
    filteredContent = filteredContent.replace(/:::admin-only\n([\s\S]*?)\n:::/g, '');
  }
  
  // Remove friend sections if user doesn't have friend or admin access
  if (userLevel < 1) {
    filteredContent = filteredContent.replace(/:::friend\n([\s\S]*?)\n:::/g, '');
  }
  
  // Convert markdown to JSX elements
  const processContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headers
      if (line.startsWith('# ')) {
        if (currentParagraph) {
          elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed">{processInlineMarkdown(currentParagraph)}</p>);
          currentParagraph = '';
        }
        elements.push(<h1 key={`h1-${i}`} className="text-3xl font-bold text-slate-900 mb-6 leading-tight">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        if (currentParagraph) {
          elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed">{processInlineMarkdown(currentParagraph)}</p>);
          currentParagraph = '';
        }
        elements.push(<h2 key={`h2-${i}`} className="text-2xl font-semibold text-slate-900 mb-4 leading-tight">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        if (currentParagraph) {
          elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed">{processInlineMarkdown(currentParagraph)}</p>);
          currentParagraph = '';
        }
        elements.push(<h3 key={`h3-${i}`} className="text-xl font-medium text-slate-900 mb-3 leading-tight">{line.substring(4)}</h3>);
      } else if (line.startsWith(':::admin-only')) {
        // Skip clearance markers (already filtered above)
        continue;
      } else if (line.startsWith(':::friend')) {
        // Skip clearance markers (already filtered above)
        continue;
      } else if (line === ':::') {
        // Skip clearance end markers
        continue;
      } else if (line.trim() === '') {
        if (currentParagraph) {
          elements.push(<p key={`p-${i}`} className="mb-4 text-slate-700 leading-relaxed">{processInlineMarkdown(currentParagraph)}</p>);
          currentParagraph = '';
        }
      } else {
        currentParagraph += line + ' ';
      }
    }
    
    if (currentParagraph) {
      elements.push(<p key={`p-final`} className="mb-4 text-slate-700 leading-relaxed">{processInlineMarkdown(currentParagraph)}</p>);
    }
    
    return elements;
  };
  
  const processInlineMarkdown = (text: string) => {
    // Process inline markdown
    const parts = [];
    let currentText = text;
    let key = 0;
    
    // Bold text
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push({ type: 'bold', content, key: key++ });
      return placeholder;
    });
    
    // Italic text
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push({ type: 'italic', content, key: key++ });
      return placeholder;
    });
    
    // Inline code
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      const placeholder = `__CODE_${key}__`;
      parts.push({ type: 'code', content, key: key++ });
      return placeholder;
    });
    
    // Links
    currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
      const placeholder = `__LINK_${key}__`;
      parts.push({ type: 'link', content: linkText, url, key: key++ });
      return placeholder;
    });
    
    // Split by placeholders and rebuild with React elements
    const segments = currentText.split(/(__[A-Z]+_\d+__)/);
    
    return segments.map((segment, index) => {
      const match = segment.match(/__([A-Z]+)_(\d+)__/);
      if (match) {
        const part = parts.find(p => p.key === parseInt(match[2]));
        if (part) {
          switch (part.type) {
            case 'bold':
              return <strong key={index} className="font-semibold text-slate-900">{part.content}</strong>;
            case 'italic':
              return <em key={index} className="italic">{part.content}</em>;
            case 'code':
              return <code key={index} className="bg-slate-100 px-2 py-0.5 rounded-md text-sm font-mono text-slate-800">{part.content}</code>;
            case 'link':
              return <a key={index} href={part.url} className="neon-accent hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer">{part.content}</a>;
            default:
              return segment;
          }
        }
      }
      return segment;
    });
  };
  
  return <div className="prose prose-slate max-w-none">{processContent(filteredContent)}</div>;
};
