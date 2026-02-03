import TextareaAutosize from 'react-textarea-autosize';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries/me';
import { CLOSE_TICKET, OPEN_TICKET } from '../graphql/mutations/ticketMutations';
import { SEND_MESSAGE } from '../graphql/mutations/sendMessage';
import { useState, useEffect, useRef } from 'react';
import { GET_TICKET_BY_ID } from '../graphql/queries/tickets';
import dayjs from "dayjs";
import { echo } from '../echo';

export default function ViewTicket() {
    const location = useLocation();
    const { data: meData } = useQuery(GET_ME);
    const currentUser = meData?.me;

    const [ticket, setTicket] = useState(location.state?.ticket);
    const { data, refetch } = useQuery(GET_TICKET_BY_ID, {
        variables: { id: ticket?.id },
        skip: !ticket?.id,
    });

    const [closeTicket] = useMutation(CLOSE_TICKET, { refetchQueries: ['GetMyTickets'] });
    const [openTicket] = useMutation(OPEN_TICKET, { refetchQueries: ['GetMyTickets'] });
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        refetchQueries: [{ query: GET_TICKET_BY_ID, variables: { id: ticket?.id } }],
    });

    const endRef = useRef(null);
    const inputRef = useRef(null);
    const [body, setBody] = useState('');

    useEffect(() => {
        if (data?.ticket) {
            setTicket(data.ticket);
            scrollToBottom();
        }
    }, [data]);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (ticket?.id && currentUser) {
            const channel = echo.private(`ticket.${ticket.id}`);
            channel.listen('MessageSent', (e) => {
                setTicket((prev) => ({
                    ...prev,
                    messages: [...(prev.messages || []), e.message],
                }));
                scrollToBottom();
            });
            return () => {
                channel.stopListening('MessageSent');
            };
        }
    }, [ticket?.id, currentUser]);

    const handleAction = async () => {
        if (!ticket) return;

        if (ticket.status === 'closed') {
            await openTicket({ variables: { id: ticket.id } });
        } else {
            await closeTicket({ variables: { id: ticket.id } });
        }

        // هنا بنعمل refetch عشان نجيب التذكرة بكل بياناتها من جديد
        const { data: updated } = await refetch();
        if (updated?.ticket) {
            setTicket(updated.ticket);
        }
    };

    const handleSend = async () => {
        if (!body.trim()) return;
        try {
            await sendMessage({
                variables: {
                    input: {
                        ticket_id: ticket.id,
                        body: body.trim(),
                    },
                },
            });
            setBody('');
            setTimeout(() => scrollToBottom(), 300);
        } catch (error) {
            console.error("Send Error:", error);
        }
    };

    const getButtonConfig = () => {
        const isClosed = ticket?.status === 'closed';
        const isAdmin = currentUser?.role === 'admin';
        return {
            text: isClosed ? (isAdmin ? 'Open Ticket' : 'Closed Ticket') : 'Close Ticket',
            className: `w-28 py-2 rounded-sm text-white ${isClosed ? 'bg-gray-500 cursor-not-allowed' : 'bg-third hover:shadow-2xl'} cursor-pointer`,
            disabled: isClosed && !isAdmin,
        };
    };

    const buttonConfig = getButtonConfig();

    if (!ticket) return null;

    return (
        <div className="flex flex-col space-y-7">
            {/* Controls */}
            <div className="text-white flex justify-end space-x-2">
                {ticket?.status === 'open' && (
                    <button onClick={() => inputRef.current?.scrollIntoView({ behavior: 'smooth' })} className='w-28 py-2 rounded-sm cursor-pointer bg-first hover:shadow-2xl'>Reply</button>
                )}
                <button onClick={handleAction} disabled={buttonConfig.disabled} className={buttonConfig.className}>
                    {buttonConfig.text}
                </button>
                <Link to='/' className="bg-second w-28 py-2 rounded-sm cursor-pointer hover:shadow-2xl text-center">
                    Cancel
                </Link>
            </div>

            {/* Ticket Info */}
            <div className="flex flex-col space-y-4 text-xl">
                <div className="flex justify-between">
                    <div className="flex space-x-28">
                        <p className="text-first">Title</p>
                        <input disabled value={ticket?.title} className="bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 text-lg text-gray-400" />
                    </div>
                    <div className="flex space-x-28">
                        <p className="text-first">CreatedDate</p>
                        <input disabled value={dayjs(ticket?.created_at).format("YYYY-MM-DD")} className="bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 text-lg text-gray-400" />
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex space-x-20">
                        <p className="text-first">Number</p>
                        <input disabled value={ticket?.number} className="bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 text-lg text-gray-400" />
                    </div>
                    <div className="flex space-x-28">
                        <p className="text-first">CreatedTime</p>
                        <input disabled value={dayjs(ticket?.created_at).format("hh:mm a")} className="bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 text-lg text-gray-400" />
                    </div>
                </div>

                {/* Description */}
                <div className="flex space-x-13">
                    <p className="text-first">Description</p>
                    <textarea
                        disabled
                        value={ticket?.description || ''}
                        className="bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 py-2 text-lg text-gray-400 w-full"
                    />
                </div>
            </div>

            {/* Replies */}
            <div className="flex space-x-23 text-xl">
                <p className="text-first">Replies</p>
                <div className="flex flex-col w-full space-y-7">
                    {Array.isArray(ticket.messages) && ticket.messages.map((msg) => {
                        const sender = msg?.sender;
                        const ticketOwnerMessage =  sender?.username === ticket?.user?.username;
                        {/* const isMine = sender?.id === currentUser?.id;
                        const isFromTicketOwner = sender?.id === ticket?.user?.id && !isMine; */}


                        let textColor = '';

                        if (ticketOwnerMessage) {
                            textColor = 'text-first';
                        } else {
                            textColor = 'text-second';
                        }

                        return (
                            <div key={msg.id} className={`flex justify-center items-center space-x-5 ${!ticketOwnerMessage ? 'flex-row-reverse ':''}`}>
                                <img src="/images/profile.png" alt="" className={`w-10 h-10 ${!ticketOwnerMessage ? 'ml-5 ':''}`} />
                                <div className="flex flex-col w-full">
                                    <p className={`text-sm ${textColor} ${!ticketOwnerMessage ? 'text-end':''}`}>
                                        {sender?.username || 'Unknown'}
                                    </p>
                                    <div className="relative">
                                        <TextareaAutosize
                                            disabled
                                            value={msg.body}
                                            rows={1}
                                            className={`bg-gray-100 rounded-sm border-b-1 border-gray-400 px-4 py-2 text-sm resize-none w-full ${!ticketOwnerMessage ? 'text-end':''} text-gray-400`}
                                        />
                                        <p className={`text-xs absolute bottom-2 right-2 ${!ticketOwnerMessage ? 'left-2':''} ${textColor}`}>
                                            {dayjs(msg.created_at).format("YYYY-MM-DD hh:mm a")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={endRef} />

                    {ticket?.status === 'closed' && (
                        <div className="flex justify-center items-center text-gray-500 text-sm">
                            This Ticket closed at {dayjs(ticket?.closed_at).format("YYYY-MM-DD hh:mm a")} by {ticket?.closedBy?.username || 'Unknown'}
                        </div>
                    )}

                    {ticket?.status !== 'closed' && (
                        <div ref={inputRef} className="flex justify-center items-center space-x-5">
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={2}
                                className="rounded-sm border-1 border-gray-400 px-4 py-2 text-sm resize-none text-gray-400 w-full focus:outline-first"
                            />
                            <button
                                onClick={handleSend}
                                className="text-white bg-first px-2 h-full rounded-sm text-lg hover:shadow-2xl cursor-pointer"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}