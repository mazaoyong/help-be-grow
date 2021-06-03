import { useState, Dispatch, SetStateAction, useEffect } from 'react';

interface Store<S extends object> {
  state: S;
}

abstract class Store<S extends object> {
  private setters: Dispatch<SetStateAction<S>>[] = [];
  public useStoreState = this._useStoreState.bind(this);

  private _useStoreState() {
    const [, setState] = useState(this.state);

    useEffect(() => {
      this.setters.push(setState);

      return () => { this.setters = this.setters.filter(setter => setter !== setState); };
    }, []);

    return this.state;
  }

  setState(state: Partial<S>) {
    this.state = Object.assign({}, this.state, state);
    this.setters.forEach(setter => setter(this.state));
  }
}

export default Store;
