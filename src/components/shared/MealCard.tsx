import Image from "next/image";
import { Meal } from "./FeaturedMealsSection";
import { Button } from "../ui/button";
import Link from "next/link";

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={meal.image}
          alt={meal.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{meal.title}</h3>
        <p className="text-sm text-gray-500">{meal.description}</p>
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-gray-500 mt-2">
            Prep Time: {meal.prepTime} • Servings: {meal.servings}
          </p>
          <h4 className="text-2xl">${meal.price}</h4>
        </div>
        <Button className="mt-5 w-full cursor-pointer transition-all ease-in-out duration-300 hover:outline-2 hover:outline-[#44C356] hover:text-[#44C356] hover:bg-white rounded-full">
          <Link href={`/meal/${meal.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default MealCard;
