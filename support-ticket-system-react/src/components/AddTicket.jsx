import { MdCloudUpload } from "react-icons/md";
import { Link , useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TICKET } from '../graphql/mutations/ticketMutations';
import { GET_MY_TICKETS } from '../graphql/queries/tickets'; // لازم تضيفيه
export default function AddTicket() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '' });

    const [createTicket, { loading, error }] = useMutation(CREATE_TICKET);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                variables: { input: formData },
                refetchQueries: [{ query: GET_MY_TICKETS }], // 💡 ده اللي بيعمل تحديث
                awaitRefetchQueries: true, // ✅ نضمن التحديث قبل ما ننتقل
            });
            navigate('/'); // بعد ما التذاكر اتحدثت
        } catch (err) {
            console.error("Failed to create ticket:", err);
        }
    };
    return (
        <div className="flex flex-col space-y-20 pt-6">
            <p className='text-first text-3xl'>Create New Ticket</p>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-xl">
                <div className="flex space-x-28">
                    <p className="text-first">Title</p>
                    <input aria-label="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} type="text" name="" id="title" required className="rounded-sm border-1 border-gray-400 px-4 text-lg text-gray-400" />
                </div>
                <div className="flex space-x-14">
                    <p className="text-first">Description</p>
                    <textarea value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} aria-label="title" type="text" name="" id="title" required className="rounded-sm border-1 border-gray-400 px-4 py-2 text-lg resize-none text-gray-400 w-full " rows={4} />
                </div>

                {/* <div className="flex space-x-13">
                    <p className="text-first">Attach Files</p>
                    <input aria-label="file" type="file" name="" id="file" className="hidden rounded-sm border-1 border-gray-400 px-4 text-lg text-gray-400" />
                    <label htmlFor="file" className="cursor-pointer text-gray-500 hover:text-first">
                        <MdCloudUpload className="text-3xl" />
                    </label>
                </div> */}

                {error && <p className="text-red-500">Error: {error.message}</p>}

                <div className="text-white flex justify-end space-x-2">
                    <button type="submit" className="bg-first w-28 py-1 rounded-sm  cursor-pointer hover:shadow-2xl" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
                    <Link to='/' className="bg-third w-28 py-1 rounded-sm cursor-pointer hover:shadow-2xl text-center">Cancel</Link>
                </div>
            </form>
        </div>
    );
}
