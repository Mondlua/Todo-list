
const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
        <img src={imgSrc} alt='Sin notas' className="w-60" />
        <p className="w-1/2 text-sm font-semibold text-[#5b50b1] text-center leading-7 mt-5">
            {message}
        </p>
    </div>
  )
}

export default EmptyCard