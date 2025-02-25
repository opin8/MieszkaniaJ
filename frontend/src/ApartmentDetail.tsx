import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define the Apartment type based on your Java model
interface Apartment {
    id: number;
    city: string;
    postalCode: string;
    street: string;
    houseNumber: number;
    apartmentNumber: number;
    area: number; // or double in Java, but number in TS
    numberOfRooms: number;
    storageUnit: boolean;
    parkingSpotNumber: number | null; // Since it's an Integer in Java, it can be null
}

function ApartmentDetail() {
    const { id } = useParams<{ id: string }>(); // Specify the type for useParams
    const navigate = useNavigate();
    const [apartment, setApartment] = useState<Apartment | null>(null); // Use the Apartment type or null

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const response = await axios.get<Apartment>(`/api/apartments/${id}`);
                setApartment(response.data);
            } catch (error) {
                console.error("Error fetching apartment:", error);
                navigate("/"); // Redirect to dashboard if not found
            }
        };

        fetchApartment();
    }, [id, navigate]);

    if (!apartment) return <div>Ładowanie...</div>;

    return (
        <div className="apartment-detail">
            <h1>Szczegóły mieszkania</h1>
            <p>Miasto: {apartment.city}</p>
            <p>Kod pocztowy: {apartment.postalCode}</p>
            <p>Ulica: {apartment.street} {apartment.houseNumber}/{apartment.apartmentNumber}</p>
            <p>Powierzchnia: {apartment.area} m²</p>
            <p>Pokoje: {apartment.numberOfRooms}</p>
            <p>Przechowalnia: {apartment.storageUnit ? "Tak" : "Nie"}</p>
            {apartment.parkingSpotNumber && (
                <p>Miejsce parkingowe: {apartment.parkingSpotNumber}</p>
            )}
            <button onClick={() => navigate("/")}>Powrót</button>
        </div>
    );
}

export default ApartmentDetail;