import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUserUrls, deleteUserUrl } from '../api/user.api';

const UserUrl = () => {
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000, // Refetch every 30 seconds to update click counts
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  });
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUserUrl(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['userUrls'] });
      const previousData = queryClient.getQueryData(['userUrls']);
      
      queryClient.setQueryData(['userUrls'], (old) => {
        if (!old || !old.urls) return old;
        return {
          ...old,
          urls: old.urls.filter((u) => u._id !== deletedId),
        };
      });
      
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['userUrls'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userUrls'] });
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setConfirmDeleteId(null);
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center my-8 text-[#333] font-bold text-[13px]'>
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4'>
        Error loading your URLs: {error.message}
      </div>
    );
  }



  return (
    <div className='border border-gray-300 bg-white mb-4'>
      <div className='bg-[#e1e1e1] px-3 py-1.5 border-b border-gray-300 font-bold text-[13px]'>
        Your URLs
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse text-[13px]'>
          <thead>
            <tr>
              <th className='border-r border-b border-gray-300 px-3 py-2 font-bold w-1/3 bg-[#f8f8f8] text-gray-700'>
                Original URL
              </th>
              <th className='border-r border-b border-gray-300 px-3 py-2 font-bold bg-[#f8f8f8] text-gray-700'>
                Short URL
              </th>
              <th className='border-r border-b border-gray-300 px-3 py-2 font-bold bg-[#f8f8f8] text-gray-700 w-20 text-center'>
                Clicks
              </th>
              <th className='border-b border-gray-300 px-3 py-2 font-bold bg-[#f8f8f8] text-gray-700 w-[140px] text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {urls?.urls?.length > 0 ? (
              [...(urls.urls || [])].reverse().map((url, index) => (
                <tr
                  key={url._id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}
                >
                  <td className='border-r border-b border-gray-300 px-3 py-2 truncate max-w-[250px]'>
                    <a
                      href={url.long_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#0000ee] hover:text-[#cc0000] hover:underline'
                    >
                      {url.long_url}
                    </a>
                  </td>
                  <td className='border-r border-b border-gray-300 px-3 py-2'>
                    <a
                      href={`${import.meta.env.VITE_BASE_URL}/${url.short_url}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#0000ee] hover:text-[#cc0000] hover:underline font-bold'
                    >
                      {`${import.meta.env.VITE_BASE_URL?.replace(/^https?:\/\//, '')}/${url.short_url}`}
                    </a>
                  </td>
                  <td className='border-r border-b border-gray-300 px-3 py-2 text-center'>
                    <span className='font-bold text-[15px]'>{url.clicks}</span>
                  </td>
                  <td className='border-b border-gray-300 px-3 py-2 text-center'>
                    <div className='w-[130px] mx-auto flex justify-center'>
                      {confirmDeleteId === url._id ? (
                        <div className='flex items-center space-x-1'>
                          <span className='text-[13px] text-gray-700 font-bold'>Sure?</span>
                          <button
                            onClick={() => handleDelete(url._id)}
                            className='bg-[#ffe6e6] text-[#cc0000] border border-gray-400 px-2 py-0.5 hover:bg-[#ffcccc] text-[12px] font-bold cursor-pointer'
                            disabled={deleteMutation.isPending}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className='bg-[#f8f8f8] text-black border border-gray-400 px-2 py-0.5 hover:bg-[#e8e8e8] text-[12px] cursor-pointer'
                            disabled={deleteMutation.isPending}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              handleCopy(
                                `${import.meta.env.VITE_BASE_URL}/${url.short_url}`,
                                url._id,
                              )
                            }
                            className='bg-[#f8f8f8] text-black border border-gray-400 px-3 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer'
                          >
                            {copiedId === url._id ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(url._id)}
                            className='bg-[#f8f8f8] text-black border border-gray-400 px-3 py-1 hover:bg-[#e8e8e8] text-[13px] cursor-pointer'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className='border-b border-gray-300 px-3 py-4 text-center text-gray-700 font-bold text-[13px] bg-white'>
                  No URLs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUrl;
