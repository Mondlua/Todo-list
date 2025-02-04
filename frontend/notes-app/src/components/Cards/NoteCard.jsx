import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete  } from 'react-icons/md';

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
}) => {
  return (
    <div className="border rounded-sm p-4 bg-white hover:shadow-xl hover:shadow-[#dccfec] transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-semibold text-primary">{title}</h6>
          <span className="text-xs text-[#8c6a9e]">{moment(date).format('D MMMM YYYY')}</span>
        </div>
        <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-[#c5a9d3]'}`} onClick={onPinNote} />
      </div>
      <p className='text-xs text-[#372142] mt-2'>{content?.slice(0,60)}</p>
      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-[#8c6a9e]'>{tags.map((tag) => `#${tag} `)}</div>
        <div className='flex items-center gap-2'>
          <MdCreate 
            className='icon-btn hover:text-green-600'
            onClick={onEdit}
          />
          <MdDelete 
            className='icon-btn hover:text-red-600'
            onClick={onDelete}
          />
        </div>
      </div>    
    </div>
  )
}

export default NoteCard