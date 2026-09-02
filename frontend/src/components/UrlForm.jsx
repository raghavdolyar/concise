import { useState, useEffect } from 'react';
import { createShortUrl } from '../api/shortUrl.api';
import { useSelector } from 'react-redux';
import { queryClient } from '../main';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState('');
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    setError(null);
    setCustomSlug('');
    setShortUrl(null);
    setUrl('');
    setCopied(false);
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    try {
      const shortUrl = await createShortUrl(url, customSlug);
      setShortUrl(shortUrl);
      queryClient.invalidateQueries({ queryKey: ['userUrls'] });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className='border border-gray-300 rounded-sm mb-4 bg-white'>
      <div className='bg-[#e1e1e1] px-3 py-1.5 border-b border-gray-300 font-bold text-[13px]'>
        Shorten a URL
      </div>
      <div className='p-4 space-y-4'>
        <div className='flex flex-col space-y-1'>
          <label htmlFor='url' className='text-[13px] font-bold text-gray-700'>
            Enter your URL:
          </label>
            <input
              type='url'
              id='url'
              value={url}
              onInput={event => setUrl(event.target.value)}
              placeholder='https://www.example.com'
              required
              autoComplete='off'
              className='w-full px-2 py-1.5 border border-gray-400 focus:outline-none focus:border-gray-500 text-[13px]'
            />
        </div>

        {isAuthenticated && (
          <div className='flex flex-col space-y-1'>
            <label
              htmlFor='customSlug'
              className='text-[13px] font-bold text-gray-700'
            >
              Custom URL (optional):
            </label>
            <input
              type='text'
              id='customSlug'
              value={customSlug}
              onChange={event => setCustomSlug(event.target.value)}
              placeholder='Enter custom slug'
              autoComplete='off'
              className='w-full px-2 py-1.5 border border-gray-400 focus:outline-none focus:border-gray-500 text-[13px]'
            />
          </div>
        )}

        <div>
          <button
            onClick={handleSubmit}
            type='submit'
            className='bg-[#f8f8f8] text-black border border-gray-400 px-4 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer'
          >
            Shorten
          </button>
        </div>

        {error && (
          <div className='mt-2 p-2 bg-red-100 border border-red-300 text-[#cc0000] text-[13px]'>
            {error}
          </div>
        )}

        {shortUrl && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='font-bold text-[13px] mb-1'>
              Your shortened URL:
            </div>
            <div className='flex items-center'>
              <input
                type='text'
                readOnly
                value={shortUrl}
                className='flex-1 px-2 py-1 border border-gray-400 bg-gray-50 text-[13px] mr-2'
              />
              <button
                onClick={handleCopy}
                className='bg-[#f8f8f8] text-black border border-gray-400 px-3 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer'
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
