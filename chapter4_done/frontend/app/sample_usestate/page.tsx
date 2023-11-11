"use client";
export default function Page() {
    const showDialog = () => {
        alert("アラート");
    };
    return (
        <div>
            <button onClick={showDialog()}>Click</button>
        </div>
    );
}