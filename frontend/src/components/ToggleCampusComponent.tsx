

function ToggleCampus({ campus, onClick }: { campus: string, onClick: () => void }) {
    const isSGW = campus === "SGW"; // GET STATE FROM PASSED PARAMETER

    return (
        <div data-testid="toggle-button" className="fixed m-4 top-30 right-0 inline-flex items-center z-20">
            <div className="w-[140px] h-[31px] bg-[#eeebeb] rounded-md shadow-[0px_1px_2.799999952316284px_0px_rgba(0,0,0,0.25)] justify-start items-center inline-flex overflow-hidden relative">
                <div
                    data-testid="toggle-button-loyola"
                    className={`w-[70px] h-[31px] rounded-md justify-center items-center flex overflow-hidden cursor-pointer ${isSGW ? 'bg-[#eeebeb]' : 'bg-[#411a72]'} `}
                    onClick={onClick}
                >
                    <div className={`text-sm font-medium  ${isSGW ? 'text-[#411a72]' : 'text-[#ededed]'}`}>LOYOLA</div>
                </div>
                <div
                    data-testid="toggle-button-sgw"
                    className={`w-[70px] h-[31px] rounded-md justify-center items-center flex overflow-hidden cursor-pointer ${isSGW ? 'bg-[#411a72]' : 'bg-[#eeebeb]'}`}
                    onClick={onClick}
                >
                    <div className={`text-sm font-semibold  ${isSGW ? 'text-[#ededed]' : 'text-[#411a72]'} `}>SGW</div>
                </div>
            </div>
        </div>
    );
};

export default ToggleCampus;