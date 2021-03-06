export default function Chats({ chats }) {
  return (
    <div className='flex flex-col items-start w-full max-w-md'>
      {chats.map(({ name_from, message, id }) => (
        <div className='flex py-2' key={id}>
          <p className='flex items-center mr-2 font-semibold'>
            <span className='inline-block truncate w-28'>{name_from}</span>:
          </p>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
}
