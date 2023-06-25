import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

function deepCompareEquals(a: any, b: any) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

const useDeepCompareEffect : typeof useEffect = (callback, dependencies) => {
  useEffect(callback, dependencies?.map(useDeepCompareMemoize));
}

export default useDeepCompareEffect;
